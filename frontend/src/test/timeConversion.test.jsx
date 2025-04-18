const convertTo12Hour = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const suffix = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${suffix}`;
};

describe("convertTo12Hour", () => {
    it("should convert 00:00 to 12:00 AM", () => {
        expect(convertTo12Hour("00:00")).toBe("12:00 AM");
    });

    it("should convert 12:00 to 12:00 PM", () => {
        expect(convertTo12Hour("12:00")).toBe("12:00 PM");
    });

    it("should convert 15:45 to 3:45 PM", () => {
        expect(convertTo12Hour("15:45")).toBe("3:45 PM");
    });

    it("should convert 01:30 to 1:30 AM", () => {
        expect(convertTo12Hour("01:30")).toBe("1:30 AM");
    });
});
