// src/models/Event.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export class Event extends Model {
    public id!: number;
    public name!: string;
    public date!: Date;
    public location!: string;
    public price!: number;
}

Event.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'events',
    }
);
