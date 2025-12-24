"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Trash2, Pencil, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AddEditProductDialog from "../AddProduct";
import { useToast } from "@/hooks/use-toast";

type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  class?: string;
  stock: number;
  brand: string;
  price: number;
  image: string;
};
interface Props {
  setSelectedClass: (object: any)=>void;
  selectedSchool: { id: string; name: string };
  selectedClass: { id: string; name: string };
}
const GRID_STYLE =
  "grid grid-cols-1 md:grid-cols-[80px_1fr_120px_100px_100px_100px] gap-3 md:gap-4 items-center";

export default function FilteredProductTable({
  setSelectedClass,
  selectedClass,
  selectedSchool,
}: Props) {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products/filter", {
        method: "POST",
        body: JSON.stringify({
          schoolId: selectedSchool.id,
          classId: selectedClass.id,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setProducts(data.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Product deleted successfully",
          variant: "default",
        });
        fetchProducts();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const renderRow = (product: Product) => (
    <div
      key={product.id}
      className={`${GRID_STYLE} px-4 py-4 md:px-6 hover:bg-muted/30 transition-colors border-b last:border-0`}
    >
      {/* Image & Name Section */}
      <div className="flex items-center gap-4 md:contents">
        <div className="flex justify-start shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-12 h-12 md:w-14 md:h-14 object-cover rounded-md border shadow-sm bg-white"
          />
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <span className="font-semibold md:font-medium text-sm text-foreground truncate">
            {product.name}
          </span>
          <div className="md:hidden mt-1 flex gap-2 items-center">
            <Badge
              variant="secondary"
              className="text-[10px] px-1.5 py-0 font-normal uppercase"
            >
              {product.brand}
            </Badge>
            <span className="text-[10px] text-muted-foreground">
              Stock: {product.stock}
            </span>
          </div>
        </div>
      </div>

      {/* Brand Column (Desktop) */}
      <div className="hidden md:flex justify-center">
        <Badge
          variant="secondary"
          className="font-normal text-[11px] uppercase tracking-wider"
        >
          {product.brand}
        </Badge>
      </div>

      {/* Stock Column (Desktop) */}
      <div className="hidden md:flex justify-center">
        <h1 className="font-bold uppercase tracking-wider text-muted-foreground text-center">
          {product.stock}
        </h1>
      </div>

      {/* Price & Actions */}
      <div className="flex items-center justify-between md:contents mt-2 md:mt-0 pt-2 md:pt-0 border-t border-dashed md:border-0">
        <div className="md:text-right">
          <span className="text-xs text-muted-foreground md:hidden mr-2">
            Price:
          </span>
          <span className="font-bold text-sm">₹{product.price}</span>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button
            size="icon"
            className="w-8 h-8 text-muted-foreground hover:scale-110 transition-all cursor-pointer"
          >
            <Dialog>
              <DialogTrigger>
                <Trash2 className="w-4 h-4" />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Are you sure you want to delete this product?
                  </DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your product from our database.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose>Cancel</DialogClose>
                  <DialogClose asChild>
                    <Button
                      onClick={() => handleDelete(product.id)}
                      variant="destructive"
                    >
                      Delete
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Button>
          <AddEditProductDialog
            selectedSchool={selectedSchool.id}
            selectedClass={selectedClass.id}
            product={product}
            onSuccess={fetchProducts}
            trigger={
              <Button
                size="icon"
                className="w-8 h-8 text-muted-foreground hover:scale-110 transition-all cursor-pointer"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );

  return (
    <Card className="w-full border-none shadow-none bg-transparent">
      <CardHeader className="px-0">
        <Button variant="ghost" onClick={()=>setSelectedClass(null)} className="gap-2 justify-self-start">
            <ArrowLeft className="h-4 w-4" />
            Back to Classes
        </Button>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="text-xl md:text-2xl font-bold tracking-tight">
            Included Items
          </CardTitle>
          <AddEditProductDialog
            selectedSchool={selectedSchool.id}
            selectedClass={selectedClass.id}
            onSuccess={fetchProducts}
          />
        </div>
      </CardHeader>

      <CardContent className="px-0">
        <Tabs defaultValue="TEXTBOOK" className="w-full">
          <div className="overflow-x-auto pb-1 scrollbar-hide">
            <TabsList className="inline-flex w-full sm:w-auto mb-6 bg-muted/50 p-1">
              <TabsTrigger
                value="TEXTBOOK"
                className="flex-1 sm:flex-none px-4 md:px-8"
              >
                Textbooks
              </TabsTrigger>
              <TabsTrigger
                value="NOTEBOOK"
                className="flex-1 sm:flex-none px-4 md:px-8"
              >
                Notebooks
              </TabsTrigger>
              <TabsTrigger
                value="STATIONARY"
                className="flex-1 sm:flex-none px-4 md:px-8"
              >
                Stationary
              </TabsTrigger>
            </TabsList>
          </div>

          {loading ? (
            <div className="py-20 text-center text-muted-foreground animate-pulse">
              Loading products...
            </div>
          ) : (
            (["TEXTBOOK", "NOTEBOOK", "STATIONARY"] as const).map((catKey) => (
              <TabsContent
                key={catKey}
                value={catKey}
                className="mt-0 outline-none"
              >
                <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                  <div
                    className={`${GRID_STYLE} hidden md:grid bg-muted/50 px-6 py-3 border-b`}
                  >
                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      Preview
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      Product Name
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground text-center">
                      Brand
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground text-center">
                      Stock
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground text-right">
                      Price
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground text-right">
                      Action
                    </span>
                  </div>

                  <div className="divide-y divide-border">
                    {products
                      .filter((p) => p.category.toUpperCase() === catKey)
                      .map(renderRow)}

                    {products.filter((p) => p.category.toUpperCase() === catKey)
                      .length === 0 && (
                      <div className="py-16 text-center text-sm text-muted-foreground">
                        No {catKey.toLowerCase()} items found.
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            ))
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
