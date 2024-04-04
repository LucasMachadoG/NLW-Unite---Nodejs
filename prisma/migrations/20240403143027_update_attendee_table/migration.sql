-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_attendess" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event_id" TEXT NOT NULL,
    CONSTRAINT "attendess_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_attendess" ("created_at", "email", "event_id", "id", "name") SELECT "created_at", "email", "event_id", "id", "name" FROM "attendess";
DROP TABLE "attendess";
ALTER TABLE "new_attendess" RENAME TO "attendess";
CREATE UNIQUE INDEX "attendess_event_id_email_key" ON "attendess"("event_id", "email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
