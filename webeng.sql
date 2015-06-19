CREATE TABLE IF NOT EXISTS `category` (
  `id` int(11) NOT NULL,
  `name` varchar(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS `todo` (
  `id` int(11) NOT NULL,
  `description` varchar(1024) NOT NULL,
  `title` varchar(256) NOT NULL,
  `created` date NOT NULL,
  `done` tinyint(1) NOT NULL,
  `category_id` int(11) NOT NULL
);

ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `category`
  ADD UNIQUE (name);

ALTER TABLE `todo`
  ADD PRIMARY KEY (`id`), ADD KEY `category_id` (`category_id`);

ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `todo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `todo`
ADD CONSTRAINT `todo_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE;