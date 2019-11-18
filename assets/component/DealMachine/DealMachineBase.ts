import { TableLocationType, Coordinate } from '../../common/Const'

export function getLocationByLocaitonType(type: TableLocationType): Coordinate {
    let coordinate: Coordinate
    switch (type) {
        case TableLocationType.LAND:
            coordinate = { x: 218, y: 136 }
            break
        case TableLocationType.LANDLORD:
            coordinate = { x: 2.5, y: 148 }
            break
        case TableLocationType.MIDDLE:
            coordinate = { x: -2.5, y: -15 }
            break
        case TableLocationType.SKY:
            coordinate = { x: -216, y: 140 }
            break
    }
    return coordinate
}

export function getCircleListByLocationType(tableLocationType: TableLocationType): any {
    switch (tableLocationType) {
        case TableLocationType.LAND:
            return [TableLocationType.LAND, TableLocationType.LANDLORD, TableLocationType.SKY,TableLocationType.MIDDLE]
        case TableLocationType.LANDLORD:
            return [TableLocationType.LANDLORD, TableLocationType.SKY, TableLocationType.MIDDLE, TableLocationType.LAND]
        case TableLocationType.MIDDLE:
            return [TableLocationType.MIDDLE, TableLocationType.LAND, TableLocationType.LANDLORD, TableLocationType.SKY]
        case TableLocationType.SKY:
            return [TableLocationType.SKY, TableLocationType.MIDDLE, TableLocationType.LAND, TableLocationType.LANDLORD]
    }
}