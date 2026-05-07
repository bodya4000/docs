-- CreateTable
CREATE TABLE `QuarterlyPeriod` (
    `id` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `quarter` INTEGER NOT NULL,

    UNIQUE INDEX `QuarterlyPeriod_year_quarter_key`(`year`, `quarter`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FinancialIndicator` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `unit` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `FinancialIndicator_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IndicatorValue` (
    `id` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
    `asOfDate` DATETIME(3) NOT NULL,
    `indicatorId` VARCHAR(191) NOT NULL,
    `periodId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `IndicatorValue_indicatorId_periodId_key`(`indicatorId`, `periodId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `IndicatorValue` ADD CONSTRAINT `IndicatorValue_indicatorId_fkey` FOREIGN KEY (`indicatorId`) REFERENCES `FinancialIndicator`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IndicatorValue` ADD CONSTRAINT `IndicatorValue_periodId_fkey` FOREIGN KEY (`periodId`) REFERENCES `QuarterlyPeriod`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
