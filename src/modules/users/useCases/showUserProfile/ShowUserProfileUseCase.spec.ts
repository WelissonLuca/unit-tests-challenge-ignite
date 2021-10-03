import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("ShowUser", () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
	});

  it("should be able to show profile user", async () => {
    const { id } = await usersRepository.create({
			name: "John Doe",
			email: "john@doe.com",
			password: "123456",
    });


		const user = await showUserProfileUseCase.execute(id);

		expect(user).toBeTruthy();
		expect(user.id).toBeTruthy();
		expect(user.name).toBe("John Doe");
		expect(user.email).toBe("john@doe.com");
	});

	it("should not be to show profile user with user non-existing", async () => {
		expect(async () => {
			 await showUserProfileUseCase.execute('id');
		}).rejects.toBeInstanceOf(ShowUserProfileError);
	});
});
