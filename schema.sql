
DROP DATABASE IF EXISTS booking;

CREATE DATABASE booking;

USE booking;

CREATE TABLE apartment (

	id int NOT NULL AUTO_INCREMENT,
	apartmentid int NOT NULL,
	price int NOT NULL,
    max int NOT NULL,
    minStay int NOT NULL,
    stars dec(4,2) NOT NULL,
    numRatings int NOT NULL,
	PRIMARY KEY (id)

);

CREATE TABLE dates (

	id int NOT NULL AUTO_INCREMENT,
	date varchar (20) NOT NULL,
	apartment_id int NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (apartment_id)
		REFERENCES apartment (id)

);


INSERT INTO apartment (apartmentid, price, minStay, stars, numRatings, max)
VALUES
("9873001" ,"40", "2", "4.83", "78", "4"),
("9873002" ,"55", "2", "4.5", "23", "3"),
("9873003" ,"90", "3", "4.95", "125", "5"),
("9873004" ,"30", "1", "4.63", "80", "2"),
("9873005" ,"65", "2", "4.9", "90", "3"),
("9873006" ,"74", "3", "2.1", "287", "3"),
("9873007" ,"70", "2", "4.75", "189", "4"),
("9873008" ,"65", "1", "4.1", "77", "3"),
("9873009" ,"30", "0", "3.9", "124", "4"),
("9873010" ,"120", "2", "4.98", "86", "1");             

INSERT INTO dates (date, apartment_id)
VALUES
("11/1/2018", (SELECT id from apartment WHERE apartmentid = "9873001")),
("11/22/2018", (SELECT id from apartment WHERE apartmentid = "9873001")),
("11/14/2018", (SELECT id from apartment WHERE apartmentid = "9873001")),
("11/2/2018", (SELECT id from apartment WHERE apartmentid = "9873001")),
("11/13/2018", (SELECT id from apartment WHERE apartmentid = "9873001")),
("11/10/2018", (SELECT id from apartment WHERE apartmentid = "9873001")),
("11/27/2018", (SELECT id from apartment WHERE apartmentid = "9873001")),
("11/20/2018", (SELECT id from apartment WHERE apartmentid = "9873001")),
("11/7/2018", (SELECT id from apartment WHERE apartmentid = "9873001")),
("11/20/2018", (SELECT id from apartment WHERE apartmentid = "9873001")),
("11/16/2018", (SELECT id from apartment WHERE apartmentid = "9873001")),
("11/24/2018", (SELECT id from apartment WHERE apartmentid = "9873002")),
("11/18/2018", (SELECT id from apartment WHERE apartmentid = "9873002")),
("11/6/2018", (SELECT id from apartment WHERE apartmentid = "9873002")),
("11/23/2018", (SELECT id from apartment WHERE apartmentid = "9873002")),
("11/1/2018", (SELECT id from apartment WHERE apartmentid = "9873002")),
("11/2/2018", (SELECT id from apartment WHERE apartmentid = "9873003")),
("11/1/2018", (SELECT id from apartment WHERE apartmentid = "9873003")),
("11/19/2018", (SELECT id from apartment WHERE apartmentid = "9873003")),
("11/12/2018", (SELECT id from apartment WHERE apartmentid = "9873003")),
("11/23/2018", (SELECT id from apartment WHERE apartmentid = "9873004")),
("11/29/2018", (SELECT id from apartment WHERE apartmentid = "9873004")),
("11/23/2018", (SELECT id from apartment WHERE apartmentid = "9873004")),
("11/2/2018", (SELECT id from apartment WHERE apartmentid = "9873004")),
("11/28/2018", (SELECT id from apartment WHERE apartmentid = "9873005")),
("11/12/2018", (SELECT id from apartment WHERE apartmentid = "9873005")),
("11/21/2018", (SELECT id from apartment WHERE apartmentid = "9873005")),
("11/22/2018", (SELECT id from apartment WHERE apartmentid = "9873005")),
("11/25/2018", (SELECT id from apartment WHERE apartmentid = "9873005")),
("11/1/2018", (SELECT id from apartment WHERE apartmentid = "9873005")),
("11/11/2018", (SELECT id from apartment WHERE apartmentid = "9873005")),
("11/24/2018", (SELECT id from apartment WHERE apartmentid = "9873005")),
("11/6/2018", (SELECT id from apartment WHERE apartmentid = "9873005")),
("11/14/2018", (SELECT id from apartment WHERE apartmentid = "9873005")),
("11/9/2018", (SELECT id from apartment WHERE apartmentid = "9873005")),
("11/20/2018", (SELECT id from apartment WHERE apartmentid = "9873005")),
("11/8/2018", (SELECT id from apartment WHERE apartmentid = "9873006")),
("11/19/2018", (SELECT id from apartment WHERE apartmentid = "9873006")),
("11/22/2018", (SELECT id from apartment WHERE apartmentid = "9873006")),
("11/7/2018", (SELECT id from apartment WHERE apartmentid = "9873006")),
("11/9/2018", (SELECT id from apartment WHERE apartmentid = "9873006")),
("11/11/2018", (SELECT id from apartment WHERE apartmentid = "9873007")),
("11/17/2018", (SELECT id from apartment WHERE apartmentid = "9873007")),
("11/25/2018", (SELECT id from apartment WHERE apartmentid = "9873007")),
("11/18/2018", (SELECT id from apartment WHERE apartmentid = "9873007")),
("11/21/2018", (SELECT id from apartment WHERE apartmentid = "9873008")),
("11/14/2018", (SELECT id from apartment WHERE apartmentid = "9873008")),
("11/8/2018", (SELECT id from apartment WHERE apartmentid = "9873008")),
("11/12/2018", (SELECT id from apartment WHERE apartmentid = "9873008")),
("11/18/2018", (SELECT id from apartment WHERE apartmentid = "9873008")),
("11/1/2018", (SELECT id from apartment WHERE apartmentid = "9873009")),
("11/19/2018", (SELECT id from apartment WHERE apartmentid = "9873010")),
("11/10/2018", (SELECT id from apartment WHERE apartmentid = "9873010"));