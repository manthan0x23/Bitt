export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Bad Request") {
    super(400, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(401, message);
  }
}
export class InternalServerError extends AppError {
  constructor(message?: string) {
    if (message) super(500, message);
    super(500, "Internal Server Error");
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Not Found") {
    super(404, message);
  }
}
