import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { ModelSelector } from "./components/ModelSelector";
import { ParameterForm } from "./components/ParameterForm";
import { ModelViewer } from "./components/ModelViewer";
import type { ModelTemplate, ModelParameters } from "./types";
import { DEFAULT_MODELS } from "./types";
import "./App.css";

function App() {
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [selectedModel, setSelectedModel] = useState<ModelTemplate | null>(
		DEFAULT_MODELS[0],
	);
	const [parameters, setParameters] = useState<ModelParameters>(
		DEFAULT_MODELS[0].defaultParams,
	);

	const handleSelectModel = (model: ModelTemplate) => {
		setSelectedModel(model);
		setParameters(model.defaultParams);
	};

	return (
		<div className="app">
			<Sidebar
				isOpen={sidebarOpen}
				onToggle={() => setSidebarOpen(!sidebarOpen)}
			/>

			<main
				className={`main-content ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
			>
				<div className="content-wrapper">
					{/* Left panel - Controls */}
					<div className="controls-panel">
						<header className="panel-header">
							<h1>Генератор корпусов</h1>
							<p className="subtitle">
								Создавайте 3D модели для печати за секунды
							</p>
						</header>

						<ModelSelector
							selectedModel={selectedModel}
							onSelectModel={handleSelectModel}
						/>

						{selectedModel && (
							<ParameterForm parameters={parameters} onChange={setParameters} />
						)}

						<div className="action-buttons">
							<button className="btn btn-primary">Скачать STL</button>
							<button className="btn btn-secondary">Сбросить параметры</button>
						</div>
					</div>

					{/* Right panel - 3D Viewer */}
					<div className="viewer-panel">
						<ModelViewer parameters={parameters} />
					</div>
				</div>
			</main>
		</div>
	);
}

export default App;
