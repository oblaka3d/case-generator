import { useState } from "react";
import { ChevronDown, Box } from "lucide-react";
import type { ModelTemplate } from "../types";
import { DEFAULT_MODELS } from "../types";
import "./ModelSelector.css";

interface ModelSelectorProps {
	selectedModel: ModelTemplate | null;
	onSelectModel: (model: ModelTemplate) => void;
}

export function ModelSelector({
	selectedModel,
	onSelectModel,
}: ModelSelectorProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="model-selector">
			<label className="selector-label">
				<Box size={16} />
				Выберите модель
			</label>

			<div className="selector-dropdown">
				<button className="selector-trigger" onClick={() => setIsOpen(!isOpen)}>
					<span className="trigger-content">
						{selectedModel ? (
							<>
								<span className="model-name">{selectedModel.name}</span>
								<span className="model-desc">{selectedModel.description}</span>
							</>
						) : (
							<span className="placeholder">Выберите шаблон корпуса...</span>
						)}
					</span>
					<ChevronDown
						size={20}
						className={`chevron ${isOpen ? "open" : ""}`}
					/>
				</button>

				{isOpen && (
					<div className="selector-options">
						{DEFAULT_MODELS.map((model) => (
							<button
								key={model.id}
								className={`option ${selectedModel?.id === model.id ? "selected" : ""}`}
								onClick={() => {
									onSelectModel(model);
									setIsOpen(false);
								}}
							>
								<div className="option-content">
									<span className="option-name">{model.name}</span>
									<span className="option-desc">{model.description}</span>
									<div className="option-params">
										<span>
											📐 {model.defaultParams.width}×
											{model.defaultParams.height}×{model.defaultParams.depth}{" "}
											мм
										</span>
										<span>
											🧱 Стенка: {model.defaultParams.wallThickness} мм
										</span>
									</div>
								</div>
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
