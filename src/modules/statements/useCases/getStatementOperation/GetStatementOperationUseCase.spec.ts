import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let statmentRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
	DEPOSIT = "deposit",
	WITHDRAW = "withdraw",
}
describe("getStatementOperation", () => {
	beforeEach(() => {
		statmentRepository = new InMemoryStatementsRepository();
		usersRepository = new InMemoryUsersRepository();
		getStatementOperationUseCase = new GetStatementOperationUseCase(
			usersRepository,
			statmentRepository
		);
	});

	it("should be able to get statement operation", async () => {
		const user = await usersRepository.create({
			name: "John Doe",
			email: "john@doe.com",
			password: "123456",
		});

    const statement = await statmentRepository.create({
			user_id: user.id,
			type: OperationType.DEPOSIT,
			amount: 100,
			description: "Salary",
		});

		const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: statement.id,
		});

		expect(statementOperation.type).toBe(OperationType.DEPOSIT);
	});
	it("should not be to get statement operation non-existing user ", async () => {
		expect(async () => {
			await getStatementOperationUseCase.execute({
				user_id: "4",
				statement_id: "1",
			});
		}).rejects.toThrowError(GetStatementOperationError.UserNotFound);
  });

  it("should not be to get statement operation non-existing statement ", async () => {
    	const user = await usersRepository.create({
				name: "John Doe",
				email: "john@doe.com",
				password: "123456",
			});
		expect(async () => {
			await getStatementOperationUseCase.execute({
				user_id: user.id,
				statement_id: "1",
			});
		}).rejects.toThrowError(GetStatementOperationError.StatementNotFound);
	});
});
