import { JobPortalDataSource } from "@/config/database.config";

beforeAll(async () => {
  if (!JobPortalDataSource.isInitialized) {
    await JobPortalDataSource.initialize();
  }
});

beforeEach(async () => {
  await JobPortalDataSource.synchronize(true);
});

afterAll(async () => {
  if (JobPortalDataSource.isInitialized) {
    await JobPortalDataSource.destroy();
  }
});
