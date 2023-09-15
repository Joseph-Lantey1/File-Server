CREATE table users (
    id serial primary key unique,
    fullname varchar(255) not null,
    email varchar(255) not null,
    password varchar(255) not null,
    type varchar(255) not null default 'user'
);

CREATE table files (
    id serial primary key unique,
    filename varchar(255) not null,
    description varchar(255) not null,
    downloads integer default 0,
    emailsent integer default 0
);