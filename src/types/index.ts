interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: {
        seconds: number;
        nanoseconds: number;
    };
}