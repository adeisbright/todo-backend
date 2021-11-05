const ItemService = require("../services/ItemService");
const FileService = require("../services/FileService");
const storageHelper = require("../lib/disk-storage-helper");
const { google } = require("googleapis");
const Item = require("../models/items");
const {
    ApplicationError,
    DbError,
    NotFoundError,
    NotAuthorizeError,
} = require("../middleware/error-handler");
const itemService = new ItemService(Item);
const fileService = new FileService(storageHelper);

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
            if (!item) {
                return next(new NotFoundError("The item was not found"));
            }
            res.status(200).json({ data: item });
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }

    async createItem(req, res) {
        if (req.file) {
            const avatarName = req.file.originalname;
            const uploadPath = "./public/uploads";
            const todosAvatarPath = "./public/todo_avatars";
            let getFilePath = await fileService.uploadToDisk(
                avatarName,
                uploadPath,
                todosAvatarPath
            );
            req.body.todo_avatar = getFilePath;
        }
        const { date, time } = req.body;
        const todoDate = new Date(`${date}T${time}`);
        req.body.created_at = todoDate;
        let item = await itemService.createItem(req.body);

        res.status(200).json({
            message: "Your item was added successfully",
            status: "200",
            data: item,
            eventUrl: authUrl,
        });
    }

    async removeItem(req, res) {
        const { id } = req.params;
        await itemService.removeItem(id);
        res.status(200).json({ message: "The item was removed" });
    }

    async updateItem(req, res) {
        try {
            const { id } = req.params;
            console.log(req.body);
            let doc = await itemService.updateItem(id, req.body);
            res.status(200).json({ data: doc, message: "Testing Something" });
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
            let tokens = {
                access_token:
                    "ya29.a0ARrdaM9sMFrT7w3nXy2FV7Zppxp3QOZXVA6Vzg71TSJwG5R4HNKl5ufZp3OfKjygfDaOh3ZeIHDWjWf9wjwdYdl35b4KBgT69FYMhARzI9JPyUrJCOXLTjzxVjO9Y2yk4cZjbP3sBJvlb3Bi_d1zfjX6i4h-",
                refresh_token:
                    "1//03PKsxqjZ8EhDCgYIARAAGAMSNwF-L9Irf_9unG8f2BOB8HIu4i6vIjoT2LWraljBRnn2R2rZowqbioCsnEXM2ZLfe6ZISJfF86I",
                scope: "https://www.googleapis.com/auth/calendar",
                token_type: "Bearer",
                expiry_date: 1635693003765,
            };
            oauth2client.setCredentials(tokens);
            const calender = google.calendar({
                version: "v3",
                oauth2client,
            });
            const eventDetails = {
                summary: req.body.summary,
                location: "online",
                description: req.body.description,
                start: {
                    date: "2021-10-02",
                },
                end: {
                    date: "2021-10-02",
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

            if (calenderEvent) {
                console.log(calenderEvent.data.htmlLink);
            } else {
                consol.log("This Google no sabi document at all");
            }
            res.status(200).json({
                expiryDate: tokens.expiry_date,
                data: "Still working on it ",
            });
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }
}

module.exports = new ItemController();
