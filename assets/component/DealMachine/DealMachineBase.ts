import { TableLocationType, Coordinate } from '../../common/Const'

export function getLocationByLocaitonType(type: TableLocationType): Coordinate {
    let coordinate: Coordinate
    switch (type) {
        case TableLocationType.LAND:
            coordinate = { x: -214, y: -147 }
            break
        case TableLocationType.LANDLORD:
            coordinate = { x: 5, y: -162 }
            break
        case TableLocationType.MIDDLE:
            coordinate = { x: 10.3, y: 10.3 }
            break
        case TableLocationType.SKY:
            coordinate = { x: 209, y: -157 }
            break
    }
    return coordinate
}

export function getCircleListByLocationType(tableLocationType: TableLocationType): any {
    switch (tableLocationType) {
        case TableLocationType.LAND:
            return [TableLocationType.LAND, TableLocationType.MIDDLE, TableLocationType.SKY, TableLocationType.LANDLORD]
        case TableLocationType.LANDLORD:
            return [TableLocationType.LANDLORD, TableLocationType.LAND, TableLocationType.MIDDLE, TableLocationType.SKY]
        case TableLocationType.MIDDLE:
            return [TableLocationType.MIDDLE, TableLocationType.SKY, TableLocationType.LANDLORD, TableLocationType.LAND]
        case TableLocationType.SKY:
            return [TableLocationType.SKY, TableLocationType.LANDLORD, TableLocationType.LAND, TableLocationType.MIDDLE]
    }
}