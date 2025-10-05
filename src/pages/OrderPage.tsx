import React, { useState } from 'react';
import { Package, Calendar, MapPin, ChevronRight, Truck, CheckCircle, Clock, XCircle, MoreVertical, Store, User, X, Loader, TrendingUp } from 'lucide-react'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; 
import { Separator } from '@/components/ui/separator'; 

// --- MOCK DATA ---
interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
    imageUrl: string;
    vendorName: string; 
    vendorBrand: string; 
}

interface Order {
    id: string;
    date: string;
    total: number;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    trackingNumber: string;
    shippingAddress: string; 
    shippingDistrict: string; 
    deliveryDate: string; 
    deliveryTime: string; 
    items: OrderItem[];
}

const mockOrders: Order[] = [
    {
        id: 'BM-250928',
        date: '2025-09-28',
        total: 1299.99,
        status: 'Delivered',
        trackingNumber: 'TRK987654321',
        shippingAddress: 'KG 545 St, House 12A, Kimihurura, Gasabo',
        shippingDistrict: 'Kigali',
        deliveryDate: 'Monday, Sep 30',
        deliveryTime: '11:00 AM',
        items: [
            { id: 1, name: 'iPhone 17 Pro Max (Deep Purple)', quantity: 1, price: 1099.99, imageUrl: 'https://i.pravatar.cc/150?img=53', vendorName: 'Alpha Electronics', vendorBrand: 'Premium Tech' },
            { id: 2, name: 'Premium Glass Screen Protector', quantity: 2, price: 100.00, imageUrl: 'https://i.pravatar.cc/150?img=5', vendorName: 'Alpha Electronics', vendorBrand: 'Premium Tech' },
        ],
    },
    {
        id: 'BM-250930',
        date: '2025-09-30',
        total: 155.50,
        status: 'Shipped',
        trackingNumber: 'TRK123456789',
        shippingAddress: 'KN 67 St, Near Amahoro Stadium, Remera, Gasabo',
        shippingDistrict: 'Gasabo',
        deliveryDate: 'Wednesday, Oct 2',
        deliveryTime: '2:00 PM - 5:00 PM',
        items: [
            { id: 3, name: 'EcoGadgets Solar Charger', quantity: 1, price: 75.00, imageUrl: 'https://i.pravatar.cc/150?img=8', vendorName: 'Eco-Trader', vendorBrand: 'Sustainable Goods' },
            { id: 4, name: 'Boutique Threads Blue Dress', quantity: 1, price: 80.50, imageUrl: 'https://i.pravatar.cc/150?img=7', vendorName: 'Boutique Threads', vendorBrand: 'Chic Style Co.' },
        ],
    },
    {
        id: 'BM-251001',
        date: '2025-10-01',
        total: 45.00,
        status: 'Pending',
        trackingNumber: 'N/A',
        shippingAddress: 'Huye Main Road, By-Pass 3, Butare',
        shippingDistrict: 'Huye',
        deliveryDate: 'N/A',
        deliveryTime: 'N/A',
        items: [
            { id: 5, name: 'Vintage Finds Camera Strap', quantity: 1, price: 45.00, imageUrl: 'https://i.pravatar.cc/150?img=12', vendorName: 'Vintage Finds Emporium', vendorBrand: 'Nostalgia Niche' },
        ],
    },
];
// -----------------


// --- PRODUCT DETAIL MODAL COMPONENT ---
interface ProductDetailModalProps {
    item: OrderItem;
    onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ item, onClose }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            
            <Card className="glass-medium backdrop-blur-3xl border border-glass-border w-full max-w-sm relative z-10 shadow-2xl">
                <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={onClose}>
                    <X className="w-5 h-5" />
                </Button>
                
                <CardHeader className="flex flex-col items-center text-center p-6">
                    <Avatar className="h-24 w-24 mb-3 border-4 border-[#ff902b] shadow-lg">
                        <AvatarImage src={item.imageUrl} alt={item.name} />
                        <AvatarFallback className="bg-gradient-primary text-white text-xl">
                            {item.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-2xl font-bold">{item.name}</CardTitle>
                    <CardDescription className="text-lg font-semibold mt-1 text-foreground">${item.price.toFixed(2)} x {item.quantity}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4 p-6 pt-0">
                    <h4 className="text-lg font-semibold text-center text-[#ff902b]">Vendor Information</h4>
                    
                    <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="flex items-center text-sm font-semibold text-foreground">
                            <Store className="w-4 h-4 mr-2 text-muted-foreground" />
                            Seller: {item.vendorName}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <User className="w-4 h-4 mr-2" />
                            Brand Identity: {item.vendorBrand}
                        </div>
                    </div>

                    <Button 
                        variant="glass-primary" 
                        className="w-full mt-4" 
                        onClick={onClose}
                    >
                        View Full Product Page
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};


// --- HELPER COMPONENT: Renders the Status Badge ---
const StatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
    const statusMap = {
        'Delivered': { text: 'Delivered', icon: CheckCircle, colorClass: 'bg-green-500 hover:bg-green-600' },
        'Shipped': { text: 'Shipped', icon: Truck, colorClass: 'bg-indigo-500 hover:bg-indigo-600' },
        'Processing': { text: 'Processing', icon: Clock, colorClass: 'bg-yellow-500 hover:bg-yellow-600' },
        'Pending': { text: 'Pending Confirmation', icon: Clock, colorClass: 'bg-gray-500 hover:bg-gray-600' },
        'Cancelled': { text: 'Cancelled', icon: XCircle, colorClass: 'bg-red-500 hover:bg-red-600' },
    };
    const { text, icon: Icon, colorClass } = statusMap[status] || statusMap.Pending;

    return (
        <Badge className={`px-3 py-1 text-xs font-semibold ${colorClass} text-white`}>
            <Icon className="w-3 h-3 mr-1" />
            {text}
        </Badge>
    );
};

// --- MAIN ORDER CARD COMPONENT ---
const OrderCard: React.FC<{ order: Order, onImageClick: (item: OrderItem) => void }> = ({ order, onImageClick }) => {
    const mainProduct = order.items[0]; 

    const deliveryInfo = order.status !== 'Delivered' && order.status !== 'Cancelled' && order.deliveryDate !== 'N/A' 
        ? `${order.deliveryDate} at ${order.deliveryTime}`
        : order.status === 'Delivered' ? 'Completed' : 'Awaiting confirmation';

    return (
        <Card className="glass-light backdrop-blur-sm border border-glass-border shadow-lg transition-all hover:shadow-xl hover:scale-[1.005]">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0 p-4 border-b border-glass-border">
                <div className="flex items-center w-full sm:w-auto">
                    {/* Image/Avatar is now clickable */}
                    <Avatar 
                        className="h-12 w-12 mr-4 border-2 border-[#ff902b] flex-shrink-0 cursor-pointer hover:opacity-90"
                        onClick={() => onImageClick(mainProduct)}
                    >
                        <AvatarImage src={mainProduct.imageUrl} alt={mainProduct.name} />
                        <AvatarFallback className="bg-gradient-primary text-white">
                            {mainProduct.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <CardTitle className="text-xl font-bold text-foreground">
                            Order #{order.id}
                        </CardTitle>
                        <CardDescription className="flex items-center text-sm text-muted-foreground mt-1">
                            <Calendar className="w-4 h-4 mr-2" />
                            Placed on {order.date}
                        </CardDescription>
                    </div>
                </div>
                <StatusBadge status={order.status} />
            </CardHeader>
            <CardContent className="p-4 space-y-3">
                
                {/* Product/Delivery Details - RESPONSIVE GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-2 border-b border-glass-border/50">
                    
                    {/* Items Summary (Takes full width on mobile) */}
                    <div className="col-span-1 md:col-span-2 space-y-1 order-2 md:order-1">
                        <p className="text-sm font-semibold text-[#ff902b] flex items-center mb-1">
                            <Package className="w-4 h-4 mr-2" />
                            Item Summary ({order.items.length}):
                        </p>
                        <ScrollArea className="h-16 pr-2">
                            {order.items.map(item => (
                                <p key={item.id} className="text-sm text-muted-foreground ml-6 truncate">
                                    {item.quantity}x **{item.name}** from {item.vendorName}
                                </p>
                            ))}
                        </ScrollArea>
                    </div>

                    {/* Delivery Location & Time (Takes full width on mobile, moves to right on desktop) */}
                    <div className="col-span-1 md:border-l border-glass-border/50 pt-3 md:pt-0 md:pl-4 space-y-3 order-1 md:order-2">
                        
                        {/* Delivery Time */}
                        <div className="pb-2 border-b border-glass-border/50 md:border-b-0 md:pb-0">
                            <p className="text-sm font-semibold text-green-400 flex items-center mb-1">
                                <Clock className="w-4 h-4 mr-2" />
                                Est. Delivery:
                            </p>
                            <p className="text-sm font-bold text-foreground break-words ml-6">
                                {deliveryInfo}
                            </p>
                        </div>
                        
                        {/* Delivery Location */}
                        <div>
                            <p className="text-sm font-semibold text-[#ff902b] flex items-center mb-1">
                                <MapPin className="w-4 h-4 mr-2" />
                                Delivery to:
                                <Badge variant="secondary" className="ml-2 bg-[#ff902b] text-white/90 hover:bg-[#ff9203]">
                                    {order.shippingDistrict}
                                </Badge>
                            </p>
                            <p className="text-xs text-muted-foreground break-words ml-6">
                                {order.shippingAddress}
                            </p>
                        </div>

                    </div>
                </div>


                {/* Total & Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 space-y-3 sm:space-y-0">
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-muted-foreground">Order Total:</span>
                        <div className="text-2xl font-extrabold text-[#ff902b]">
                            ${order.total.toFixed(2)}
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        {order.status !== 'Cancelled' && order.trackingNumber !== 'N/A' && (
                            <Button 
                                variant="glass-primary" 
                                size="sm" 
                                className="px-3 py-1 text-sm font-semibold"
                            >
                                Track <Truck className="w-4 h-4 ml-1" />
                            </Button>
                        )}
                        <Button variant="outline" size="sm" className="px-3 py-1 text-sm border-glass-border hover:bg-hover-orange/10 hover:text-[#ff9203]">
                            Invoice <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// --- HELPER FUNCTION: Calculate Dashboard Stats ---
const calculateStats = (orders: Order[]) => {
    const totalOrders = orders.length;
    const delivered = orders.filter(o => o.status === 'Delivered').length;
    const processing = orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
    const shipped = orders.filter(o => o.status === 'Shipped').length;
    const totalSpent = orders.reduce((sum, o) => sum + o.total, 0).toFixed(2);
    
    return { totalOrders, delivered, processing, shipped, totalSpent };
};


// --- DASHBOARD STATUS CARD COMPONENT ---
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass }) => (
    <Card className={`glass-light backdrop-blur-sm border border-glass-border shadow-lg ${colorClass} transition-shadow hover:shadow-xl`}>
        <CardContent className="p-4 flex items-center justify-between">
            <div>
                <CardDescription className="text-sm font-semibold text-muted-foreground uppercase">{title}</CardDescription>
                <CardTitle className="text-3xl font-extrabold mt-1">{value}</CardTitle>
            </div>
            <div className={`p-3 rounded-full bg-opacity-20 ${colorClass.replace('border-l-4', '').replace('hover:', '')} text-white`}>
                {icon}
            </div>
        </CardContent>
    </Card>
);

// --- ORDER DASHBOARD PAGE EXPORT ---
export const OrderPage: React.FC = () => {
    const [modalState, setModalState] = useState<{ isOpen: boolean, item: OrderItem | null }>({ isOpen: false, item: null });
    const stats = calculateStats(mockOrders);

    const handleImageClick = (item: OrderItem) => {
        setModalState({ isOpen: true, item });
    };

    return (
        <>
        <div className="h-full p-4 md:p-8 flex flex-col items-center">
            
            {/* 1. MAIN DASHBOARD HEADER */}
            <div className="w-full max-w-5xl mb-6">
                <h1 className="text-4xl font-extrabold bg-gradient-primary bg-clip-text text-transparent">
                    Order Dashboard 📈
                </h1>
                <p className="text-muted-foreground">Quick overview of your market activity and tracking status.</p>
            </div>
            
            {/* 2. STATUS SUMMARY CARDS */}
            <div className="w-full max-w-5xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                
                {/* DELIVERED ORDERS CARD - Success Metric */}
                <StatCard 
                    title="Delivered Orders"
                    value={stats.delivered}
                    icon={<CheckCircle className="w-6 h-6 text-green-500" />}
                    colorClass="border-l-4 border-green-500"
                />

                {/* TOTAL SPENT - Key Metric */}
                <StatCard 
                    title="Total Spent"
                    value={`$${stats.totalSpent}`}
                    icon={<TrendingUp className="w-6 h-6 text-[#ff902b]" />}
                    colorClass="border-l-4 border-[#ff902b]"
                />
                
                {/* TOTAL ORDERS */}
                <StatCard 
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={<Package className="w-6 h-6 text-indigo-500" />}
                    colorClass="border-l-4 border-indigo-500"
                />
                
                {/* IN TRANSIT - Tracking Metric */}
                <StatCard 
                    title="In Transit"
                    value={stats.shipped}
                    icon={<Truck className="w-6 h-6 text-blue-500" />}
                    colorClass="border-l-4 border-blue-500"
                />
                
                {/* PROCESSING - Actionable Metric */}
                <StatCard 
                    title="Processing"
                    value={stats.processing}
                    icon={<Loader className="w-6 h-6 text-yellow-500 animate-spin" />}
                    colorClass="border-l-4 border-yellow-500"
                />
            </div>

            {/* 3. DETAILED ORDER LIST */}
            <Card className="w-full max-w-5xl glass-medium backdrop-blur-md border border-glass-border shadow-2xl">
                <CardHeader className="p-6 border-b border-glass-border">
                    <CardTitle className="text-2xl">Detailed Order History</CardTitle>
                    <CardDescription>All purchases and tracking details, localized to **Rwanda**.</CardDescription>
                </CardHeader>
                
                <CardContent className="p-0">
                    {/* SCROLL AREA with custom class for orange scrollbar */}
                    <ScrollArea className="h-[500px] p-6 scrollbar-primary">
                        <div className="space-y-6">
                            {mockOrders.map(order => (
                                <OrderCard key={order.id} order={order} onImageClick={handleImageClick} />
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>

        {/* Product Detail Modal */}
        {modalState.isOpen && modalState.item && (
            <ProductDetailModal 
                item={modalState.item} 
                onClose={() => setModalState({ isOpen: false, item: null })} 
            />
        )}
        </>
    );
};

export default OrderPage;