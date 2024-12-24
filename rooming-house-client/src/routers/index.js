import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/login/login";
import RoomPage from "../pages/room/room";
import RoomDetailPage from "../pages/roomDetail/roomDetail";
import AdditionalPricePage from "../pages/additionalPrice/additionalPrice";
import SizePage from "../pages/size/size";
import AdminPage from "../pages/admin/admin";
import TenantPage from "../pages/tenant/tenant";
import TenantDetailPage from "../pages/tenantDetail/tenantDetail";
import DashboardPage from "../pages/dashboard/dashboard";
import PackagePage from "../pages/package/package";
import TransactionPage from "../pages/transaction/transaction";
import NotFoundPage from "../pages/notFound/notFound";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <DashboardPage />,
  },
  {
    path: "/rooms",
    element: <RoomPage />,
  },
  {
    path: "/rooms/:id",
    element: <RoomDetailPage />,
  },
  {
    path: "/transactions",
    element: <TransactionPage />,
  },
  {
    path: "/additionals",
    element: <AdditionalPricePage />,
  },
  {
    path: "/sizes",
    element: <SizePage />,
  },
  {
    path: "/admins",
    element: <AdminPage />,
  },
  {
    path: "/tenants",
    element: <TenantPage />,
  },
  {
    path: "/tenants/:id",
    element: <TenantDetailPage />,
  },
  {
    path: "/packages",
    element: <PackagePage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
