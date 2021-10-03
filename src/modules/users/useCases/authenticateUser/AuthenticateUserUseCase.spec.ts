import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { CreateUserUseCase } from '../createUser/CreateUserUseCase'

let usersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("authenticateUser", () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
	});

	it("should be able to authenticate a user", async () => {
		await createUserUseCase.execute({
			name: "John Doe",
			email: "john@doe.com",
			password: "123456",
		});

		const user = await authenticateUserUseCase.execute({
			email: "john@doe.com",
			password: "123456",
		});

    expect(user).toHaveProperty("token");
	});

	it("should not be to create a new user with password or email incorrect", async () => {
		await usersRepository.create({
			name: "John Doe",
			email: "john@doe.com",
			password: "123456",
		});

		expect(async () => {
			await authenticateUserUseCase.execute({
				email: "john@doe.com",
				password: "1234",
			});
		}).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
	});
});
