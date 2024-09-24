-- CreateTable
CREATE TABLE `reservations` (
    `receipt` INTEGER NOT NULL AUTO_INCREMENT,
    `reserved_time` VARCHAR(10) NOT NULL,
    `id_table` INTEGER NOT NULL,
    `status` INTEGER NOT NULL,
    `username` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`receipt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `reservations` ADD CONSTRAINT `reservations_username_fkey` FOREIGN KEY (`username`) REFERENCES `users`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reservations` ADD CONSTRAINT `reservations_id_table_fkey` FOREIGN KEY (`id_table`) REFERENCES `tables`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
