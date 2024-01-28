export interface WeaponsTableRow {
    id: string
    name: string
    imageLink : string
    caliber: string

    rateOfFire: number
    baseErgonomics: number
    baseRecoil: number

    recoilDispersion: number
    convergence: number
    recoilAngle: number
    cameraRecoil: number

    defaultErgonomics: number
    defaultRecoil: number

    price: number
    traderLevel: number
    fleaPrice: number
}