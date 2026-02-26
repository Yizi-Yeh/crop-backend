/*
  Warnings:

  - A unique constraint covering the columns `[sourceCalendarId]` on the table `Calendar` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Calendar_sourceCalendarId_key" ON "Calendar"("sourceCalendarId");
