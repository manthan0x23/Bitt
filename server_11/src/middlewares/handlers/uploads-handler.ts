import multer, { Options, memoryStorage } from "multer";

/**
 * Creates a multer-powered middleware for handling file uploads.
 *
 * - Uses in-memory storage (ideal for quick, small file processing).
 * - Applies optional file size and MIME type restrictions.
 * - File presence is always optional.
 *
 * @param maxSizeMB - Maximum file size in megabytes (default: 5MB).
 * @param allowedMimeTypes - Optional array of allowed MIME types (e.g., ['image/jpeg', 'application/pdf']).
 *                           If not provided, all types are allowed.
 * @returns A configured multer middleware.
 *
 * @example
 * app.post(
 *   "/upload",
 *   uploadHandler(10, ["image/png", "image/jpeg"]).single("file"),
 *   (req, res) => {
 *     const file = req.file;
 *     // handle file
 *   }
 * );
 */
export const uploadHandler = (
  maxSizeMB: number = 5,
  allowedMimeTypes?: string[]
) => {
  const storage = memoryStorage();

  const fileFilter: Options["fileFilter"] = (req, file, cb) => {
    if (!allowedMimeTypes || allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new multer.MulterError(
          "LIMIT_UNEXPECTED_FILE",
          `Invalid file type: ${file.mimetype}`
        )
      );
    }
  };

  return multer({
    storage,
    limits: {
      fileSize: maxSizeMB * 1024 * 1024,
    },
    fileFilter,
  });
};
