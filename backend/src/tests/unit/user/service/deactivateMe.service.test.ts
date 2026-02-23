/**
 * --------------------------------------------------------------------
 * MOCKS (TOP)
 * --------------------------------------------------------------------
 */
// env.config
jest.mock("@/config/env.config", () => ({
  env: {
    NODE_ENV: "test",
    POSTGRES_HOST: "0.0.0.0",
    POSTGRES_PORT: 5432,
    POSTGRES_USERNAME: "test",
    POSTGRES_PASSWORD: "test",
    POSTGRES_DATABASE: "test",
    PORT: 3000,
    JWT_SECRET: "testsecret123",
  }
}))

// user repository
jest.mock("@/modules/user/user.repository", () => ({
  userRepository: {
    findOne: jest.fn(),
    save: jest.fn()
  }
}))

/**
 * --------------------------------------------------------------------
 * Imports (AFTER MOCKS)
 * --------------------------------------------------------------------
 */
import { userRepository } from "@/modules/user/user.repository";
import { UserService } from "@/modules/user/user.service";

const userService = new UserService();

describe("userService.deactivateMe", () => {
  afterEach(() => {
    jest.clearAllMocks();
  })

  // user profile not found
  it("should fail if the user profile not found", async () => {
    (userRepository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(userService.deactivateMe("1")).rejects.toMatchObject({
      statusCode: 404
    });

    expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { id: "1" }
    });
  })

  // happy-path
  it("should successfully deactivate the user", async () => {
    const mockedUserProfile = {
      id: "1",
      name: "john",
      email: "john@example.com",
      password: "password",
      role: "RECRUITER",
      isActive: true
    };

    (userRepository.findOne as jest.Mock).mockResolvedValue(mockedUserProfile);

    const result = await userService.deactivateMe("1");

    expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { id: "1" }
    });

    expect(userRepository.save).toHaveBeenCalledTimes(1);
    expect(userRepository.save).toHaveBeenCalledWith(expect.objectContaining({
      id: "1",
      isActive: false
    }));

    expect(result).toBeUndefined();
  })
})
