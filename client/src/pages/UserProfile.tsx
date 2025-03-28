import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      className="pt-32 pb-20 px-4 md:px-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-gradient mb-6">
            Tài Khoản Của Tôi
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Quản lý hồ sơ, đơn hàng và tùy chọn của bạn
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="md:col-span-1 bg-white/5 backdrop-blur-xl border border-white/10">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h2 className="text-xl font-medium">John Doe</h2>
                  <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Chỉnh Sửa Hồ Sơ
                </Button>
              </div>
              
              <div className="mt-8 space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-muted-foreground">Thành viên từ</span>
                  <span>Tháng 1/2023</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-muted-foreground">Đơn hàng</span>
                  <span>12</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-muted-foreground">Sản phẩm yêu thích</span>
                  <span>8</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2">
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="w-full mb-8 grid grid-cols-3">
                <TabsTrigger value="account">Tài Khoản</TabsTrigger>
                <TabsTrigger value="orders">Đơn Hàng</TabsTrigger>
                <TabsTrigger value="addresses">Địa Chỉ</TabsTrigger>
              </TabsList>
              
              <TabsContent value="account">
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <CardTitle>Thông Tin Tài Khoản</CardTitle>
                    <CardDescription>
                      Cập nhật thông tin chi tiết và tùy chọn tài khoản
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Tên</Label>
                        <Input id="firstName" defaultValue="John" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Họ</Label>
                        <Input id="lastName" defaultValue="Doe" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="john.doe@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Điện Thoại</Label>
                      <Input id="phone" defaultValue="+1 234 567 890" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Mật Khẩu Hiện Tại</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Mật Khẩu Mới</Label>
                        <Input id="newPassword" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Xác Nhận Mật Khẩu</Label>
                        <Input id="confirmPassword" type="password" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="rounded-full">Lưu Thay Đổi</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="orders">
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <CardTitle>Lịch Sử Đơn Hàng</CardTitle>
                    <CardDescription>
                      Xem và theo dõi đơn hàng gần đây của bạn
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {[1, 2, 3].map((order) => (
                        <div 
                          key={order} 
                          className="p-4 rounded-lg border border-white/10 hover:border-accent/30 transition-colors"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Đơn hàng #{100000 + order}</span>
                                <span className="px-2 py-1 text-xs rounded-full bg-accent/20 text-accent-foreground">
                                  {order === 1 ? 'Đã giao' : order === 2 ? 'Đang vận chuyển' : 'Đang xử lý'}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                Đặt ngày {order === 1 ? '12/06/2023' : order === 2 ? '29/05/2023' : '15/04/2023'}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium">${(order * 299).toFixed(2)}</p>
                              <p className="text-sm text-muted-foreground mt-1">{order + 1} sản phẩm</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-2 md:mt-0"
                              asChild
                            >
                              <Link to={`/order/${100000 + order}`}>Xem Đơn Hàng</Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="addresses">
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <CardTitle>Địa Chỉ Đã Lưu</CardTitle>
                    <CardDescription>
                      Quản lý địa chỉ giao hàng và thanh toán của bạn
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Địa Chỉ Mặc Định</h3>
                        <div className="text-sm text-muted-foreground mt-2 space-y-1">
                          <p>John Doe</p>
                          <p>123 Main Street</p>
                          <p>Apt 4B</p>
                          <p>New York, NY 10001</p>
                          <p>United States</p>
                          <p>+1 234 567 890</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm">Sửa</Button>
                        <Button variant="outline" size="sm" className="ml-2">Xóa</Button>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button className="rounded-full">Thêm Địa Chỉ Mới</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UserProfile;
