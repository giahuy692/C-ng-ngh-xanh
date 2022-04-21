
module.exports = function Cart(oldCart){
    //Lưu trữ các sản phẩm hiện tại đã được thêm 
    this.items = oldCart.items || {};
    //Lưu trữ các sản phẩm hiện tại đã được thêm về tổng số lượng
    this.totalQty = oldCart.totalQty || 0;
    //Lưu trữ các sản phẩm hiện tại đã được thêm tổng tiền
    this.totalPrice = oldCart.totalPrice|| 0;

    this.add = function(item, id){
        //kiểm tra các items đã có trong dòng 4
        var storedItem = this.items[id];

        //Nếu khác thì khởi tạo nó 
        if(!storedItem){
            storedItem = this.items[id] = {item: item, qty:0,price:0};
        }

        //Tăng số lượng lên 1
        storedItem.qty++;

        //Tính tổng tiền
        storedItem.price = storedItem.item.price * storedItem.qty;
        
        //Tăng tổng số lượng thêm 1
        this.totalQty++;

        // Lưu tổng tiền
        this.totalPrice += storedItem.item.price;
    };

    this.plusByOne = function (id) {
        this.items[id].qty++;
        this.items[id].price += this.items[id].item.price;
        this.totalQty++;
        this.totalPrice += this.items[id].item.price;
    };

    this.reduceByOne = function (id) {
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.price;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.price;

        if (this.items[id].qty <= 0) {
            delete this.items[id];
        }
    };

    this.removeItem = function(id) {
        //Trừ đi tổng số lượng của sản phẩm đó
        this.totalQty -= this.items[id].qty;
        //Trừ đi tổng giá của sản phẩm đó
        this.totalPrice -= this.items[id].price;
        //xóa items đó 
        delete this.items[id];
    };

    this.generateArray = () =>{
        var arr = [];
        //Lưu các sản phẩm dưới dạng arr 
        for(var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    };
};