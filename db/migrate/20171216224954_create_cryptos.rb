class CreateCryptos < ActiveRecord::Migration[5.1]
  def change
    create_table :cryptos do |t|
      t.string :symbol
      t.decimal :price, precision: 8, scale: 2

      t.timestamps
    end
  end
end
