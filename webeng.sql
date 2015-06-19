-- phpMyAdmin SQL Dump
-- version 4.3.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Erstellungszeit: 19. Jun 2015 um 19:21
-- Server-Version: 5.6.24
-- PHP-Version: 5.6.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Datenbank: `webeng`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `group`
--

CREATE TABLE IF NOT EXISTS `group` (
  `id` int(11) NOT NULL,
  `name` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- RELATIONEN DER TABELLE `group`:
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `todonote`
--

CREATE TABLE IF NOT EXISTS `todonote` (
  `id` int(11) NOT NULL,
  `description` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created` date NOT NULL,
  `done` tinyint(1) NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- RELATIONEN DER TABELLE `todonote`:
--   `group_id`
--       `group` -> `id`
--

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `group`
--
ALTER TABLE `group`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `todonote`
--
ALTER TABLE `todonote`
  ADD PRIMARY KEY (`id`), ADD KEY `group_id` (`group_id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `group`
--
ALTER TABLE `group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT für Tabelle `todonote`
--
ALTER TABLE `todonote`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `todonote`
--
ALTER TABLE `todonote`
ADD CONSTRAINT `todonote_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
