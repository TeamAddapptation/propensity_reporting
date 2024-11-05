import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import ROITracker from "./pages/roiTracker/ROITracker";
import PerformanceTracker from "./pages/performanceTracker/PerformanceTracker";
import MarketingROI from "./pages/marketingROI/MarketingROI";

const queryClient = new QueryClient();

function Reporting() {
	const workspaceId = "a0TJw0000016PJkMAM";
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const page = params.get("page");

	switch (page) {
		case "roi_tracker":
			return <ROITracker workspaceId={workspaceId} />;
		case "performance_tracker":
			return <PerformanceTracker workspaceId={workspaceId} />;
		case "roi_marketing":
			return <MarketingROI workspaceId={workspaceId} />;
		default:
			return <Navigate to='/reporting?page=roi_tracker' />;
	}
}

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Router>
				<div className='d-flex vh-100 vw-100'>
					{/* Sidebar */}
					<nav className='bg-dark text-white p-3 flex-shrink-0' style={{ width: "250px" }}>
						<h4 className='text-center'>Dashboard</h4>
						<ul className='nav flex-column'>
							<li className='nav-item'>
								<Link to='/reporting?page=roi_tracker' className='nav-link text-white'>
									ROI Tracker
								</Link>
							</li>
							<li className='nav-item'>
								<Link to='/reporting?page=performance_tracker' className='nav-link text-white'>
									Performance Tracker
								</Link>
							</li>
							<li className='nav-item'>
								<Link to='/reporting?page=roi_marketing' className='nav-link text-white'>
									Marketing ROI
								</Link>
							</li>
						</ul>
					</nav>

					{/* Content Area */}
					<div className='flex-grow-1 p-4 overflow-auto'>
						<Routes>
							<Route path='/reporting' element={<Reporting />} />
							<Route path='*' element={<Navigate to='/reporting?page=roi_tracker' />} />
						</Routes>
					</div>
				</div>
			</Router>
		</QueryClientProvider>
	);
}

export default App;
