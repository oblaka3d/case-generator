export interface ModelParameters {
	width: number;
	height: number;
	depth: number;
	wallThickness: number;
	hasVentilation: boolean;
	hasMountingHoles: boolean;
}

export interface ModelTemplate {
	id: string;
	name: string;
	description: string;
	defaultParams: ModelParameters;
	thumbnail?: string;
}

export const DEFAULT_MODELS: ModelTemplate[] = [
	{
		id: "basic-box",
		name: "Базовый корпус",
		description: "Простой прямоугольный корпус для электроники",
		defaultParams: {
			width: 80,
			height: 60,
			depth: 40,
			wallThickness: 2,
			hasVentilation: false,
			hasMountingHoles: true,
		},
	},
	{
		id: "ventilated-box",
		name: "Вентилируемый корпус",
		description: "Корпус с отверстиями для вентиляции",
		defaultParams: {
			width: 100,
			height: 80,
			depth: 50,
			wallThickness: 2,
			hasVentilation: true,
			hasMountingHoles: true,
		},
	},
	{
		id: "compact-case",
		name: "Компактный корпус",
		description: "Минималистичный корпус для небольших проектов",
		defaultParams: {
			width: 50,
			height: 40,
			depth: 25,
			wallThickness: 1.5,
			hasVentilation: false,
			hasMountingHoles: false,
		},
	},
];
