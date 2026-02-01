import { useState } from "react";
import {
	Menu,
	X,
	ChevronLeft,
	ChevronRight,
	Box,
	Settings,
	Download,
	Info,
} from "lucide-react";
import "./Sidebar.css";

interface SidebarProps {
	isOpen: boolean;
	onToggle: () => void;
	logoUrl?: string;
}

interface MenuItem {
	id: string;
	label: string;
	icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
	{ id: "generator", label: "Генератор", icon: <Box size={20} /> },
	{ id: "templates", label: "Шаблоны", icon: <Settings size={20} /> },
	{ id: "download", label: "Скачать STL", icon: <Download size={20} /> },
	{ id: "about", label: "О проекте", icon: <Info size={20} /> },
];

export function Sidebar({ isOpen, onToggle, logoUrl }: SidebarProps) {
	const [activeItem, setActiveItem] = useState("generator");

	return (
		<>
			{/* Mobile menu button */}
			<button
				className="mobile-menu-btn"
				onClick={onToggle}
				aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
			>
				{isOpen ? <X size={24} /> : <Menu size={24} />}
			</button>

			{/* Sidebar */}
			<aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
				{/* Toggle button for desktop */}
				<button
					className="sidebar-toggle"
					onClick={onToggle}
					aria-label={isOpen ? "Свернуть меню" : "Развернуть меню"}
				>
					{isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
				</button>

				{/* Logo */}
				<div className="sidebar-logo">
					{logoUrl ? (
						<img src={logoUrl} alt="Logo" className="logo-image" />
					) : (
						<div className="logo-placeholder">
							<Box size={32} />
							{isOpen && <span>CaseGen</span>}
						</div>
					)}
				</div>

				{/* Navigation */}
				<nav className="sidebar-nav">
					{menuItems.map((item) => (
						<button
							key={item.id}
							className={`nav-item ${activeItem === item.id ? "active" : ""}`}
							onClick={() => setActiveItem(item.id)}
							title={!isOpen ? item.label : undefined}
						>
							<span className="nav-icon">{item.icon}</span>
							{isOpen && <span className="nav-label">{item.label}</span>}
						</button>
					))}
				</nav>

				{/* Footer */}
				{isOpen && (
					<div className="sidebar-footer">
						<p>Case Generator v0.1</p>
					</div>
				)}
			</aside>

			{/* Overlay for mobile */}
			{isOpen && <div className="sidebar-overlay" onClick={onToggle} />}
		</>
	);
}
