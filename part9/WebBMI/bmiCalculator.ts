// BMI formula = weight(kg) / (height(cm) / 100 ** 2 )

import { isNotNumber } from "./utils"


interface BmiInputs {
    weight: number,
    height: number
}

const parseArguments = (args: string[]): BmiInputs => {
    if(args.length !== 2) throw new Error("Please provide exactly two arguments: weight(kg) and height(cm).")
    
    const weight = Number(args[0])
    const height = Number(args[1])

    if (isNotNumber(weight) || isNotNumber(height)) {
        throw new Error("Provided values for weight and height must be numbers!")
    }
    return {
        weight,
        height
    }
}

const calculateBmi = (weight: number, height: number): string => {
    if (height === 0) throw new Error("Height can't be 0!")
    const bmi = weight / (height / 100) ** 2

    if (bmi < 18.5) return `Underweight (BMI = ${bmi.toFixed(2)})`
    if (bmi >= 18.5 && bmi < 25) return `Normal range (BMI = ${bmi.toFixed(2)})`
    if (bmi >= 25 && bmi < 30) return `Overweight (BMI = ${bmi.toFixed(2)})`
    return `Obese (BMI = ${bmi.toFixed(2)})`
}

try {
    const { weight, height } = parseArguments(process.argv.slice(2))
    const bmiResult = calculateBmi(weight, height)
    console.log(`The BMI calculation for ${weight}kg and ${height}cm is: ${bmiResult}`)
} catch (error: unknown) {
    let errorMessage = "Something went wrong. "
    if (error instanceof Error) {
        errorMessage += "Error: " + error.message
    }
    console.log(errorMessage)
}