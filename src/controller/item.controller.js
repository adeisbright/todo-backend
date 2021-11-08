const ItemService = require("../services/ItemService");
const FileService = require("../services/FileService");
// const storageHelper = require("../lib/disk-storage-helper");
const storageHelper = require("../lib/google-storage-helper");
const { google } = require("googleapis");
const Item = require("../models/items");
const {
    ApplicationError,
    DbError,
    NotFoundError,
    NotAuthorizeError,
    BadRequestError,
} = require("../middleware/error-handler");
const itemService = new ItemService(Item);
const fileService = new FileService(storageHelper);
const UserService = require("../services/UserService");

const oauth2client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3500/aouth2"
);

const scopes = ["https://www.googleapis.com/auth/calendar"];

const authUrl = oauth2client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "select_account",
});

class ItemController {
    async getItems(req, res) {
        const pageNumber = Math.abs(parseInt(req.query.page_no)) || 1;
        const offset = parseInt(req.query.offset) || 10;
        const skip = offset * (pageNumber - 1);

        // console.log(pageNumber, offset, skip);
        let queryParams = {};
        let from, to;
        if (req.query.from && req.query.to) {
            from = req.query.from;
            to = req.query.to;
        }
        //console.log(new Date(from).getTime(), to);
        if (from && to) {
            let end = new Date(to);
            end.setDate(end.getDate() + 1);
            queryParams.created_at = {
                $gte: new Date(from).getTime(),
                $lte: end.getTime(),
            };
        }
        let items = await itemService.getItems(queryParams, skip, offset);
        res.status(200).json({
            data: items,
            status: 200,
            message: "OK",
        });
    }

    async getItem(req, res, next) {
        try {
            const { id } = req.params;
            let item = await itemService.getSingleItem(id);
            res.status(200).json({ data: item });
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }

    async createItem(req, res, next) {
        try {
            const { startDate, startTime, dueDate, dueTime } = req.body;
            req.body.startNum = new Date(`${startDate}T${startTime}`).getTime();
            req.body.endNum = new Date(`${dueDate}T${dueTime}`).getTime();

            const user = await UserService.findUser("id", req.id);
            req.userId = req.id;
            let item = await itemService.createItem(req.body);
            const response = {
                message: "Your item was added successfully",
                status: "200",
                data: item,
            };
            if (!user.google_calender_token) {
                response.eventUrl = authUrl;
            } else {
                response.ok = true;
            }
            res.status(200).json(response);
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }

    async removeItem(req, res) {
        const { id } = req.params;
        await itemService.removeItem(id);
        res.status(200).json({ message: "The item was removed", ok: true });
    }

    async updateItem(req, res, next) {
        try {
            const { id } = req.params;

            let doc = await itemService.updateItem(id, req.body);
            res.status(200).json({
                data: doc,
                status: 200,
                message: "Your task was updated successfully",
            });
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }

    async getCalenderCode(req, res) {
        try {
            const code = req.query.code;
            res.redirect(`http://localhost:3000/events?code=${code}`);
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

    async createGoogleEvent(req, res, next) {
        try {
            let { summary, description, start, end, code } = req.body;
            let googleToken;
            const id = req.id;
            const user = await UserService.findUser("id", id);
            if (user.google_calender_token) {
                googleToken = user.google_calender_token;
            } else if (code) {
                //Use the code sent to retrieve and set token
                const { tokens } = await oauth2client.getToken(code);
                googleToken = tokens;
                await UserService.updateUser(
                    "google_calender_token",
                    googleToken,
                    id
                );
            } else {
                return next(new BadRequestError("Unable to create event"));
            }

            oauth2client.setCredentials(googleToken);
            const calender = google.calendar({
                version: "v3",
                oauth2client,
            });

            const eventDetails = {
                summary: summary,
                location: "Personal Device",
                description: description,
                start: {
                    date: start.date,
                },
                end: {
                    date: end.date,
                },
                reminders: {
                    useDefault: true,
                },
            };

            let calenderEvent = await calender.events.insert({
                auth: oauth2client,
                calendarId: "primary",
                resource: eventDetails,
            });

            res.status(200).json({
                link: calenderEvent.data.htmlLink,
                data: "Your event was added to calender successfully",
            });
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }
}

module.exports = new ItemController();
