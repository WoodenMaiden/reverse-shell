# Use the official PHP image as the base image
FROM php:latest

ENV COMPOSER_ALLOW_SUPERUSER=1

RUN apt update 
RUN apt install git -y -qq

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

RUN composer require slim/slim:"4.*"
RUN composer require slim/psr7
RUN composer require illuminate/database
RUN composer require illuminate/events
RUN composer require vlucas/phpdotenv


# Copy the index.php file into the container
COPY index.php .
COPY index.html .

CMD [ "php", "-S", "localhost:80", "./index.php" ]
