import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Loader2Icon } from 'lucide-react'
import { BarChart } from "../barChart"

export function AnalyticsCard({ 
  countriesLoading, 
  productsByCountryLoading, 
  uniqueProducts, 
  selectedCountry, 
  setSelectedCountry,
  countries,
  productStats 
}) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">Product Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        {countriesLoading || productsByCountryLoading ? (
            <div className="flex justify-center items-center h-full min-h-[400px]">
            <Loader2Icon className="animate-spin" />
            </div>
        ) : (
            <>
            <div className="space-y-6">
                <div className="flex items-center justify-between"> 
                <BarChart 
                    data={uniqueProducts.map(product => ({
                    name: product.product_name,
                    sales_units: product.sales_units || 0
                    }))}
                    xAxis="name"
                    yAxis="sales_units"
                    title="Product Sales"
                />
                <div className="flex flex-col items-start justify-center gap-2">
                    <div className='flex flex-row items-center justify-between gap-2'>
                    <p className="text-sm font-bold">Country</p>
                    <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                        <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                        {countries.map(country => (
                            <SelectItem key={country} value={country}>
                            {country}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    </div>
                    
                    <div className="flex flex-col w-full">
                    <div className="text-center flex items-center justify-between gap-2">
                        <p className="text-sm text-muted-foreground">Total Products</p>
                        <p className="text-xl font-bold">{productStats.totalProducts}</p>
                    </div>
                    <div className="text-center flex items-center justify-between gap-2">
                        <p className="text-sm text-muted-foreground">Total Sales</p>
                        <p className="text-xl font-bold">{productStats.totalSales.toLocaleString()}</p>
                    </div>
                    <div className="text-center flex items-center justify-between gap-2">
                        <p className="text-sm text-muted-foreground">Avg Sales/Product</p>
                        <p className="text-xl font-bold">{productStats.averageSalesPerProduct.toLocaleString()}</p>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </>
        )}
      </CardContent>
    </Card>
  )
}