import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let statmentRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
	DEPOSIT = "deposit",
	WITHDRAW = "withdraw",
}
describe("getBalance", () => {
	beforeEach(() => {
		statmentRepository = new InMemoryStatementsRepository();
		usersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
			statmentRepository,
			usersRepository
		);
	});

	it("should be able to get balance", async () => {
		const { id } = await usersRepository.create({
			name: "John Doe",
			email: "john@doe.com",
			password: "123456",
		});

		await statmentRepository.create({
			user_id: id,
			type: OperationType.DEPOSIT,
			amount: 100,
			description: "Salary",
    });

    await statmentRepository.create({
			user_id: id,
			type: OperationType.DEPOSIT,
			amount: 1000,
			description: "Salary",
    });

    await statmentRepository.create({
			user_id: id,
			type: OperationType.WITHDRAW,
			amount: 100,
			description: "Salary",
		});


    const balance = await getBalanceUseCase.execute({
      user_id: id,
    })

    expect(balance.balance).toBe(1000);
	});
	it("should not be to get balancewith non-existing user ", async () => {
		expect(async () => {
			await getBalanceUseCase.execute({
				user_id: "4",
			});
		}).rejects.toThrowError(GetBalanceError);
	});
});
