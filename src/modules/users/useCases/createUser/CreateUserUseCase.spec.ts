import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("createUser", () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		createUserUseCase = new CreateUserUseCase(usersRepository);
	});

	it("should be able to create a new user", async () => {
		const user = await createUserUseCase.execute({
			name: "John Doe",
			email: "john@doe.com",
			password: "123456",
		});

		expect(user).toBeTruthy();
		expect(user.id).toBeTruthy();
		expect(user.name).toBe("John Doe");
		expect(user.email).toBe("john@doe.com");
	});

	it("should not be to create a new user with user already exists", async () => {
		await createUserUseCase.execute({
			name: "John Doe",
			email: "john@doe.com",
			password: "123456",
		});

		expect(async () => {
			await createUserUseCase.execute({
				name: "John Doe",
				email: "john@doe.com",
				password: "123456",
			});
		}).rejects.toBeInstanceOf(CreateUserError);
  });
});
