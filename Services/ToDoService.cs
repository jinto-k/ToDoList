using Microsoft.EntityFrameworkCore;
using System.Collections;
using ToDoList.Data;
using ToDoList.Interfaces;
using ToDoList.Models;

namespace ToDoList.Services
{
    public class ToDoService: IToDoService
    {
        private readonly DataContext _context;
        public ToDoService(DataContext dataContext)
        {
            _context = dataContext;
        }

        public async Task<IEnumerable<ToDo>> GetAllToDos()
        {
            return await _context.ToDos.ToListAsync();
        }
    }
}
