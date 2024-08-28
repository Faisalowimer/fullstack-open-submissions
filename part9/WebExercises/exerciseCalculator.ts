import { isNotNumber } from "./utils";

interface ExerciseInputs {
    target: number
    dailyHours: number[]
}

interface ExerciseResult {
    periodLength: number
    trainingDays: number
    success: boolean
    rating: number
    ratingDescription: string
    target: number
    average: number
}

const parseArguments = (args: string[]): ExerciseInputs => {
    if (args.length < 2) throw new Error("Please provide atleast two arguments: target and one or more daily exercise hours.");
    
    const target = Number(args[0]);
    if (isNotNumber(target)) throw new Error("The target value must be a valid number.");

    const dailyHours = args.slice(1).map(hour => {
        const parsedHour = Number(hour);
        if (isNotNumber(parsedHour)) {
            throw new Error(`Invalid number provided for daily hours: ${hour}.`);
        }
        return parsedHour;
    });
    
    return {
        target,
        dailyHours
    };
};

 export const calculateExercises = (target: number, dailyHours: number[]): ExerciseResult => {
    const periodLength = dailyHours.length;
    const trainingDays = dailyHours.filter(day => day > 0).length;
    const totalHours = dailyHours.reduce((acc, curr) => acc + curr, 0);
    const average = totalHours / periodLength;
    const success = average >= target;

    const { rating, ratingDescription } = (() => {
        if (average >= target) {
           return {
            rating: 3,
            ratingDescription: "Great job, you met your goal!"
           }; 
        } else if (average >= target * 0.75) {
            return {
            rating: 2,
            ratingDescription: "Not too bad but could be better."
            };
        } else {
            return {
                rating: 1,
                ratingDescription: "You need to work harder to meet your goal."
            };
        }
    })();

    return {
        periodLength,
        trainingDays,
        success,
        rating,
        ratingDescription,
        target,
        average
    };
};

try {
    const { target, dailyHours } = parseArguments(process.argv.slice(2));
    const exerciseResult = calculateExercises(target, dailyHours);
    console.log(exerciseResult);
} catch (error: unknown) {
    let errorMessage = "Something went wrong. ";
    if (error instanceof Error) {
        errorMessage += "Error: " + error.message;
    }
    console.log(errorMessage);
}