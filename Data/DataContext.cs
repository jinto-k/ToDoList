﻿using Microsoft.EntityFrameworkCore;
using ToDoList.Models;

namespace ToDoList.Data
{
    public class DataContext:DbContext
    {
        public DataContext(DbContextOptions<DataContext>options): base(options)
        {
                
        }
        public DbSet<ToDo> ToDos { get; set; }
    }
}
