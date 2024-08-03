using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ToDoList.Data;
using ToDoList.Interfaces;

namespace ToDoList.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ToDoController : ControllerBase
    {
        private readonly IToDoService _service;
        public ToDoController(IToDoService toDoService)
        {
            _service = toDoService;
        }
        [HttpGet]
        public  async Task<IActionResult> GetAllList()
        {
            var toDos= await _service.GetAllToDos();
            return Ok(toDos);
        }
    }
}
