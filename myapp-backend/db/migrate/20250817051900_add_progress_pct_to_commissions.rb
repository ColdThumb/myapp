# rails g migration AddProgressPctToCommissions
class AddProgressPctToCommissions < ActiveRecord::Migration[8.0]
  def change
    add_column :commissions, :progress_pct, :integer, null: false, default: 0
    add_check_constraint :commissions, "progress_pct BETWEEN 0 AND 100", name: "comm_progress_pct_0_100"
    add_index :commissions, :progress_pct
  end
end
