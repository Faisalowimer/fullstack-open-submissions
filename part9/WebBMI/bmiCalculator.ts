// BMI formula = weight(kg) / (height(cm) / 100 ** 2 )

export const calculateBmi = (weight: number, height: number): string => {
    if (height === 0) throw new Error("Height can't be 0!")
    const bmi = weight / (height / 100) ** 2

    if (bmi < 18.5) return `Underweight (BMI = ${bmi.toFixed(2)})`
    if (bmi >= 18.5 && bmi < 25) return `Normal range (BMI = ${bmi.toFixed(2)})`
    if (bmi >= 25 && bmi < 30) return `Overweight (BMI = ${bmi.toFixed(2)})`
    return `Obese (BMI = ${bmi.toFixed(2)})`
}

if (require.main === module) {
    const weight = Number(process.argv[2])
    const height = Number(process.argv[3])

    if (!weight || !height) {
    console.log("Please provide height and weight as arguments.")
    } else {
    console.log(`BMI: ${calculateBmi(weight, height)}`);
    }
}