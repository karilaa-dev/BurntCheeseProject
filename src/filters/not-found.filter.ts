// Jesse created this
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  NotFoundException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { join } from 'path';

// If Nest finds an unknown domain it will throw a NotFoundException which will
// be caught by this filter. The filter will redirect the user to a "Page Not
// Found!" page to allow a graceful error. If the user starts the url with
// '/api' it will redirect to a graceful JSON error.
@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const url = request.url;

    if (url.startsWith('/api')) {
      return response.status(404).json({
        statusCode: 404,
        message: 'API route not found',
      });
    }

    return response
      .status(404)
      .sendFile(join(process.cwd(), 'public/html/not_found.html'));
  }
}
