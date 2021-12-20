import { main } from "../index";

global.console.log = jest.fn();
jest.mock("prompt-sync", () => {
  const PromptSync = jest.fn().mockReturnValue("q");
  return jest.fn(() => PromptSync);
});
describe("index", () => {
  it("should log a thank you message", () => {
    main();
    expect(console.log).toBeCalled();
    expect(console.log).toBeCalledWith("Thank you for using our product!");
  });
});
