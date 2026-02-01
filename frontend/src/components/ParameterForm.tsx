import { Ruler, Layers, Wind, CircleDot } from "lucide-react";
import type { ModelParameters } from "../types";
import "./ParameterForm.css";

interface ParameterFormProps {
	parameters: ModelParameters;
	onChange: (params: ModelParameters) => void;
}

interface NumberInputProps {
	label: string;
	icon: React.ReactNode;
	value: number;
	min: number;
	max: number;
	step: number;
	unit: string;
	onChange: (value: number) => void;
}

function NumberInput({
	label,
	icon,
	value,
	min,
	max,
	step,
	unit,
	onChange,
}: NumberInputProps) {
	return (
		<div className="param-field">
			<label className="param-label">
				{icon}
				{label}
			</label>
			<div className="param-input-group">
				<input
					type="number"
					value={value}
					min={min}
					max={max}
					step={step}
					onChange={(e) => onChange(parseFloat(e.target.value) || min)}
					className="param-input"
				/>
				<span className="param-unit">{unit}</span>
			</div>
			<input
				type="range"
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={(e) => onChange(parseFloat(e.target.value))}
				className="param-slider"
			/>
		</div>
	);
}

export function ParameterForm({ parameters, onChange }: ParameterFormProps) {
	const updateParam = <K extends keyof ModelParameters>(
		key: K,
		value: ModelParameters[K],
	) => {
		onChange({ ...parameters, [key]: value });
	};

	return (
		<div className="parameter-form">
			<h3 className="form-title">Параметры корпуса</h3>

			<div className="form-section">
				<h4 className="section-title">Размеры</h4>
				<NumberInput
					label="Ширина"
					icon={<Ruler size={16} />}
					value={parameters.width}
					min={20}
					max={500}
					step={1}
					unit="мм"
					onChange={(v) => updateParam("width", v)}
				/>
				<NumberInput
					label="Высота"
					icon={<Ruler size={16} />}
					value={parameters.height}
					min={20}
					max={500}
					step={1}
					unit="мм"
					onChange={(v) => updateParam("height", v)}
				/>
				<NumberInput
					label="Глубина"
					icon={<Ruler size={16} />}
					value={parameters.depth}
					min={10}
					max={300}
					step={1}
					unit="мм"
					onChange={(v) => updateParam("depth", v)}
				/>
			</div>

			<div className="form-section">
				<h4 className="section-title">Конструкция</h4>
				<NumberInput
					label="Толщина стенки"
					icon={<Layers size={16} />}
					value={parameters.wallThickness}
					min={0.8}
					max={10}
					step={0.2}
					unit="мм"
					onChange={(v) => updateParam("wallThickness", v)}
				/>

				<div className="param-toggles">
					<label className="toggle-item">
						<div className="toggle-info">
							<Wind size={16} />
							<span>Вентиляция</span>
						</div>
						<input
							type="checkbox"
							checked={parameters.hasVentilation}
							onChange={(e) => updateParam("hasVentilation", e.target.checked)}
							className="toggle-input"
						/>
						<span className="toggle-slider" />
					</label>

					<label className="toggle-item">
						<div className="toggle-info">
							<CircleDot size={16} />
							<span>Монтажные отверстия</span>
						</div>
						<input
							type="checkbox"
							checked={parameters.hasMountingHoles}
							onChange={(e) =>
								updateParam("hasMountingHoles", e.target.checked)
							}
							className="toggle-input"
						/>
						<span className="toggle-slider" />
					</label>
				</div>
			</div>
		</div>
	);
}
