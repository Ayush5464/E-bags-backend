import multer from "multer"


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "../uploads")
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9)
        cb(null, file.originalname + "-" + uniqueName)
    }
})

export const upload = multer({ storage, })