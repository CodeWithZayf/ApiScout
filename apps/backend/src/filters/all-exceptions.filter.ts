import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string | string[] = 'Internal server error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const body = exception.getResponse();
            message =
                typeof body === 'string'
                    ? body
                    : (body as any).message ?? (body as any).error ?? message;
        } else if (
            exception instanceof Prisma.PrismaClientKnownRequestError
        ) {
            switch (exception.code) {
                case 'P2002':
                    status = HttpStatus.CONFLICT;
                    message = 'A record with that value already exists';
                    break;
                case 'P2025':
                    status = HttpStatus.NOT_FOUND;
                    message = 'Record not found';
                    break;
                default:
                    this.logger.error(`Prisma error ${exception.code}`, exception.stack);
            }
        } else {
            this.logger.error('Unhandled exception', exception instanceof Error ? exception.stack : exception);
        }

        response.status(status).json({
            statusCode: status,
            message,
        });
    }
}
