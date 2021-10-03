import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateStatementError } from './CreateStatementError'
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let statmentRepository: InMemoryStatementsRepository
let usersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
		DEPOSIT = "deposit",
		WITHDRAW = "withdraw",
	}
describe("createStatement", () => {
  beforeEach(() => {
    statmentRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();

		createStatementUseCase = new CreateStatementUseCase(
			usersRepository,
			statmentRepository
    );


	});

	it("should be able to create a new statement deposit", async () => {
		const { id } = await usersRepository.create({
			name: "John Doe",
			email: "john@doe.com",
			password: "123456"
		});


		const statement = await createStatementUseCase.execute({
			user_id: id,
			type: OperationType.DEPOSIT,
			amount: 100,
      description: "Salary",
    });

    expect(statement).toHaveProperty("id");
    expect(statement.amount).toBe(100);
  });

  it("should be able to create a new statement with-draw", async () => {
		const { id } = await usersRepository.create({
			name: "John Doe",
			email: "john@doe.com",
			password: "123456",
		});

    await createStatementUseCase.execute({
			user_id: id,
			type: OperationType.DEPOSIT,
			amount: 1000,
			description: "Salary",
    });

		const statement = await createStatementUseCase.execute({
			user_id: id,
			type: OperationType.WITHDRAW,
			amount: 100,
			description: "Salary",
		});

		expect(statement).toHaveProperty("id");
		expect(statement.amount).toBe(100);
	});

  it("should not be to create a new statement with insufficient funds ", async () => {
    const { id } = await usersRepository.create({
			name: "John Doe",
			email: "john@doe.com",
			password: "123456",
		});

    expect(async () => {
			await createStatementUseCase.execute({
				user_id: id,
				type: OperationType.WITHDRAW,
				amount: 1000,
				description: "Salary",
			});
		}).rejects.toThrowError(CreateStatementError.InsufficientFunds);

  });

   it("should not be to create a new statement with non-existing user ", async () => {
			expect(async () => {
				await createStatementUseCase.execute({
					user_id: '10',
					type: OperationType.WITHDRAW,
					amount: 1000,
					description: "Salary",
				});
			}).rejects.toThrowError(CreateStatementError.InsufficientFunds);
		});
});
