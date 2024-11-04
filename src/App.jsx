import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import ROITracker from "./pages/roiTracker/ROITracker";
import PerformanceTracker from "./pages/performanceTracker/PerformanceTracker";
import MarketingROI from "./pages/marketingROI/MarketingROI";

const queryClient = new QueryClient();

function App() {
	const workspaceId = "a0TJw0000016PJkMAM";

	return (
		<QueryClientProvider client={queryClient}>
			<Router>
				<div className='d-flex vh-100 vw-100'>
					{/* Sidebar */}
					<nav className='bg-dark text-white p-3 flex-shrink-0' style={{ width: "250px" }}>
						<h4 className='text-center'>Dashboard</h4>
						<ul className='nav flex-column'>
							<li className='nav-item'>
								<Link to='/roi_tracker' className='nav-link text-white'>
									ROI Tracker
								</Link>
							</li>
							<li className='nav-item'>
								<Link to='/performance_tracker' className='nav-link text-white'>
									Performance Tracker
								</Link>
							</li>
							<li className='nav-item'>
								<Link to='/roi_marketing' className='nav-link text-white'>
									Marketing ROI
								</Link>
							</li>
						</ul>
					</nav>

					{/* Content Area */}
					<div className='flex-grow-1 p-4 overflow-auto'>
						<Routes>
							<Route path='/roi_tracker' element={<ROITracker workspaceId={workspaceId} />} />
							<Route path='/performance_tracker' element={<PerformanceTracker workspaceId={workspaceId} />} />
							<Route path='/roi_marketing' element={<MarketingROI workspaceId={workspaceId} />} />
							<Route path='*' element={<Navigate to='/roi_tracker' />} />
						</Routes>
					</div>
				</div>
			</Router>
		</QueryClientProvider>
	);
}

export default App;
