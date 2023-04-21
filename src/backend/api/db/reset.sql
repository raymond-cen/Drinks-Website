PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE users(
	userid integer primary key,
	username text unique not null,
	email text unique not null,
	password text not null,
	imageurl text
);
INSERT INTO users VALUES(1,'admin','admin','8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',NULL);
INSERT INTO users VALUES(2,'tester','tester','9bba5c53a0545e0c80184b946153c9f58387e3bd1d4ee35740f29ac2e718b019',NULL);
CREATE TABLE tokens(
	tokenid integer primary key,
	token text unique not null,
	user integer not null,
	FOREIGN KEY(user) REFERENCES users(userid)
);
INSERT INTO tokens VALUES(1,'admin',1);
INSERT INTO tokens VALUES(2,'tester',2);
CREATE TABLE admins(
	adminid integer primary key,
	userid integer unique,
	FOREIGN KEY(userid) REFERENCES users(userid)
);
INSERT INTO admins VALUES(1,1);
CREATE TABLE recipes(
	recipeid integer primary key,
	name text unique not null,
	description text,
	method text,
	imageurl text,
	creator integer,
	creationtime text,
	popularity integer,
	FOREIGN KEY(creator) REFERENCES users(userid)
);
CREATE TABLE saved_recipes(
	recipeid integer not null,
	userid integer not null,
	PRIMARY KEY(recipeid, userid),
	FOREIGN KEY(recipeid) REFERENCES recipes(recipeid),
	FOREIGN KEY(userid) REFERENCES users(userid)
);
CREATE TABLE ingredients(
	ingredientid integer primary key,
	name text unique not null,
	tags text
);
CREATE TABLE has_ingredient(
	recipe integer,
	ingredient integer,
	quantity text,
	measurement text,
	PRIMARY KEY(recipe, ingredient),
	FOREIGN KEY(recipe) REFERENCES recipes(recipeid),
	FOREIGN KEY(ingredient) REFERENCES ingredients(ingredientid)
);
CREATE TABLE tags(
	tagid integer primary key,
	name text unique not null
);
CREATE TABLE has_tag(
	recipe integer,
	tag integer,
	PRIMARY KEY(recipe, tag)
	FOREIGN KEY(recipe) REFERENCES recipes(recipeid),
	FOREIGN KEY(tag) REFERENCES tags(tagid)
);
CREATE TABLE ingredient_has_tag(
	ingredient integer,
	tag integer,
	PRIMARY KEY(ingredient, tag),
	FOREIGN KEY(ingredient) REFERENCES ingredients(ingredientid),
	FOREIGN KEY(tag) REFERENCES tags(tagid)
);
CREATE TABLE reviews(
	reviewid integer primary key,
	recipeid integer,
	creator integer,
	rating integer not null,
	reviewtext text not null,
	creationtime text,
	FOREIGN KEY(recipeid) REFERENCES recipes(recipeid),
	FOREIGN KEY (creator) REFERENCES users(userid)
);
INSERT INTO reviews VALUES(1,1,1,3,'','2022-07-20 00:00:00');
INSERT INTO reviews VALUES(2,1,1,5,'','2022-07-20 00:00:00');
INSERT INTO reviews VALUES(3,2,1,1,'','2022-07-20 00:00:00');
INSERT INTO reviews VALUES(4,15,1,4,'','2022-07-20 00:00:00');
INSERT INTO reviews VALUES(5,18,1,5,'','2022-07-20 00:00:00');
CREATE TABLE comments(
	commentid integer primary key,
	reviewid integer,
	creator integer,
	commenttext text not null,
	creationtime text,
	FOREIGN KEY(reviewid) REFERENCES reviews(reviewid),
	FOREIGN KEY (creator) REFERENCES users(userid)
);
COMMIT;
