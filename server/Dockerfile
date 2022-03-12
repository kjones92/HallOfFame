FROM php:7.4
RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli

COPY . .
EXPOSE 8080

CMD ["php", "-S", "0.0.0.0:8080"]